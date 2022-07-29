// taken from better-sqlite3
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/better-sqlite3/index.d.ts
export interface DBOptions {
  readonly?: boolean | undefined
  fileMustExist?: boolean | undefined
  timeout?: number | undefined
  verbose?: ((message?: any, ...additionalArgs: any[]) => void) | undefined
}

interface RunResult {
  changes: number
  lastInsertRowid: number | bigint
}
export interface IAsyncSqlite {
  new(): this

  init(filename: string, options?: DBOptions): Promise<void>

  exec(sql: string): Promise<boolean>

  run<BindParameters extends any[]>(sql: string, ...params: BindParameters): Promise<RunResult>
  all<BindParameters extends any[], ResultType>(sql: string, ...params: BindParameters): Promise<ResultType[]>
  get<BindParameters extends any[], ResultType>(sql: string, ...params: BindParameters): Promise<ResultType>

  raw_all<BindParameters extends any[], ResultType>(sql: string, ...params: BindParameters): Promise<ResultType[]>
  pluck_all<BindParameters extends any[], ResultType>(sql: string, ...params: BindParameters): Promise<ResultType[]>
  pluck_get<BindParameters extends any[], ResultType>(sql: string, ...params: BindParameters): Promise<ResultType>

  dispose(): Promise<void>
}
