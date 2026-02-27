import "server-only";

type PgModuleLike = {
  Pool: new (opts: { connectionString: string }) => unknown;
};

export async function loadPgModule(): Promise<PgModuleLike> {
  return (await import(/* webpackIgnore: true */ "pg")) as PgModuleLike;
}
