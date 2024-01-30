const uuid = () => crypto.randomUUID();

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export class Database {
  private db: Record<string, Todo> = {};

  public create(title: string) {
    const id = uuid();
    this.db[id] = {id, title, completed: false};
    return this.db[id];
  }

  public read(id: string) {
    return this.db[id];
  }

  public update(
    id: string,
    {
      title,
      completed,
    }: {
      title: string;
      completed: boolean;
    }
  ) {
    this.db[id] = {id, title, completed};

    return this.db[id];
  }

  public delete(id: string) {
    delete this.db[id];
  }

  public all() {
    return {
      todos: Object.keys(this.db).map((id) => this.db[id]),
    };
  }
}

let localDb: Database | undefined;
export const getDb = () => {
  if (!localDb) {
    localDb = new Database();
  }
  return localDb;
};
