import { DataSource } from "typeorm";

const datasource = new DataSource({
  type: "sqljs",
  location: "./db.sqlite",
  autoSave: true,
  entities: ["./src/entities/**/*.{js,ts}"],
  logging: true,
  synchronize: true,
});

export default datasource;
