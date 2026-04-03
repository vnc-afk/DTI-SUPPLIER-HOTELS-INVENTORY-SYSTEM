interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  data?: unknown;
}

class Logger {
  private formatLog(level: string, message: string, data?: unknown): LogEntry {
    const log: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };
    if (data) {
      log.data = data;
    }
    return log;
  }

  info(message: string, data?: unknown): void {
    const log = this.formatLog('INFO', message, data);
    console.log(JSON.stringify(log));
  }

  error(message: string, data?: unknown): void {
    const log = this.formatLog('ERROR', message, data);
    console.error(JSON.stringify(log));
  }

  warn(message: string, data?: unknown): void {
    const log = this.formatLog('WARN', message, data);
    console.warn(JSON.stringify(log));
  }

  debug(message: string, data?: unknown): void {
    if (process.env.DEBUG === 'true') {
      const log = this.formatLog('DEBUG', message, data);
      console.log(JSON.stringify(log));
    }
  }
}

export const logger = new Logger();
