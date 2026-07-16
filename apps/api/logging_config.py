"""
Centralized logging configuration for the CiTBIN API.

Call ``configure_logging()`` once at application startup.
All modules should use ``logger = logging.getLogger(__name__)``.
"""

from __future__ import annotations

import json
import logging
import logging.handlers
import os
import sys
from contextvars import ContextVar
from datetime import datetime, timezone
from logging import LogRecord
from pathlib import Path
from typing import Any

import colorlog

# ---------------------------------------------------------------------------
# Request-ID context variable
# ---------------------------------------------------------------------------

request_id_var: ContextVar[str] = ContextVar("_request_id", default="")

# ---------------------------------------------------------------------------
# JSON formatter (production)
# ---------------------------------------------------------------------------


class _JSONFormatter(logging.Formatter):
    """Produces JSON lines consumable by log aggregators (ELK, Grafana, …)."""

    def format(self, record: LogRecord) -> str:
        entry: dict[str, Any] = {
            "timestamp": datetime.fromtimestamp(
                record.created, tz=timezone.utc
            ).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        if record.exc_info and record.exc_info[0]:
            entry["exception"] = {
                "type": record.exc_info[0].__name__,
                "message": str(record.exc_info[1]),
            }

        rid = request_id_var.get()
        if rid:
            entry["request_id"] = rid

        return json.dumps(entry, default=str, ensure_ascii=False)


# ---------------------------------------------------------------------------
# Bootstrap root logger
# ---------------------------------------------------------------------------


def configure_logging(log_file: str | None = None) -> None:
    """
    Configure the root logger from environment variables.

    Recognised environment variables:

    * ``LOG_LEVEL`` — one of ``DEBUG``, ``INFO``, ``WARNING``, ``ERROR``,
      ``CRITICAL`` (default ``INFO``).
    * ``LOG_FORMAT_JSON`` — set to ``1`` / ``true`` to emit structured JSON
      instead of plain text (applies to both console and file).
    * ``LOG_COLORS`` — set to ``0`` / ``false`` to disable ANSI colour codes
      in the console (ignored when JSON is active).
    * ``APP_LOG_FILE`` — path to the rotating log file; set to empty to
      disable file logging entirely.

    Call this **once** from ``app.py`` before any other module logs.
    Subsequent calls are idempotent — the root logger's handlers will not
    be duplicated.
    """
    level_name = os.getenv("LOG_LEVEL", "INFO").upper()
    level = getattr(logging, level_name, logging.INFO)
    log_format_json = os.getenv("LOG_FORMAT_JSON", "false").lower() in (
        "1",
        "true",
        "yes",
    )
    log_colors = os.getenv("LOG_COLORS", "true").lower() in (
        "1",
        "true",
        "yes",
    )
    app_log_file = os.getenv("APP_LOG_FILE", "logs/app.log")

    root = logging.getLogger()
    root.setLevel(level)

    # Prevent duplicate handlers on repeated calls (hot-reload safety)
    if root.handlers:
        return

    # ---- Console handler ------------------------------------------------
    if log_format_json:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(_JSONFormatter())
    elif log_colors:
        console_handler = colorlog.StreamHandler(sys.stdout)
        console_handler.setFormatter(
            colorlog.ColoredFormatter(
                "%(log_color)s%(asctime)s [%(levelname)-7s] %(name)s: %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S",
                log_colors={
                    "DEBUG": "cyan",
                    "INFO": "green",
                    "WARNING": "yellow",
                    "ERROR": "red",
                    "CRITICAL": "bold_red,bg_white",
                },
            )
        )
    else:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(
            logging.Formatter(
                "%(asctime)s [%(levelname)-7s] %(name)s: %(message)s",
                datefmt="%Y-%m-%d %H:%M:%S",
            )
        )
    console_handler.setLevel(logging.DEBUG)
    root.addHandler(console_handler)

    # ---- File handler ---------------------------------------------------
    if not app_log_file:
        root.info("Logging configured (console only, file disabled)")
        return

    log_path = Path(app_log_file)
    log_dir = log_path.parent
    if log_dir and not log_dir.exists():
        try:
            log_dir.mkdir(parents=True, exist_ok=True)
        except OSError as exc:
            root.warning("Could not create log directory %s: %s", log_dir, exc)

    try:
        file_handler = logging.handlers.RotatingFileHandler(
            str(log_path),
            maxBytes=10 * 1024 * 1024,  # 10 MiB
            backupCount=5,
            encoding="utf-8",
        )

        if log_format_json:
            file_handler.setFormatter(_JSONFormatter())
        else:
            file_handler.setFormatter(
                logging.Formatter(
                    "%(asctime)s [%(levelname)-7s] %(name)s:%(lineno)d | "
                    "%(message)s",
                    datefmt="%Y-%m-%d %H:%M:%S",
                )
            )

        file_handler.setLevel(logging.DEBUG)
        root.addHandler(file_handler)
        root.info(
            "Logging configured: level=%s json=%s colors=%s file=%s",
            level_name,
            log_format_json,
            log_colors,
            log_path,
        )
    except OSError as exc:
        root.error("Cannot open log file %s: %s", log_path, exc)

    # ---- Suppress noisy third-party loggers ----------------------------
    for noisy in ("uvicorn.access", "sqlalchemy.engine", "pika"):
        logging.getLogger(noisy).setLevel(logging.WARNING)



