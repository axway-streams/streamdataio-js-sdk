export declare enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3
}
export declare class Logger {
    /**
     * @private
     * @memberOf Logger#
     */
    static console: Console;
    /**
     * @private
     * @memberOf Logger#
     */
    static level: LogLevel;
    static debug(msg: string, ...args: any[]): void;
    static info(msg: string, ...args: any[]): void;
    static warn(msg: string, ...args: any[]): void;
    static error(msg: string, ...args: any[]): void;
    /**
     * @private
     * @memberOf Logger#
     */
    private static _formatLog;
}
