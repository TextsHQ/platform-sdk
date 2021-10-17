// taken from better-sqlite3
export interface DBOptions {
  readonly?: boolean | undefined
  fileMustExist?: boolean | undefined
  timeout?: number | undefined
  verbose?: ((message?: any, ...additionalArgs: any[]) => void) | undefined
}

export interface IAsyncSqlite {
  new(): this

  init(filename: string, options?: DBOptions): Promise<void>

  exec(sql: string): Promise<any>

  all(sql: string, bindParameters?: any[]): Promise<any>
  get(sql: string, bindParameters?: any[]): Promise<any>
  run(sql: string, bindParameters?: any[]): Promise<any>

  raw_all(sql: string, bindParameters?: any[]): Promise<any>
  pluck_all(sql: string, bindParameters?: any[]): Promise<any>
  pluck_get(sql: string, bindParameters?: any[]): Promise<any>

  dispose(): Promise<void>
}
