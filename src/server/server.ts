import { Server, Model, Factory, Response } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  let server = new Server({
    environment,

    models: {
      employee: Model.extend({
        name: (i: number) => `Employee ${i}`,
        email: (i: number) => `employee${i}@example.com`,
        phoneNumber: (i: number) => `+1 (555) 555-00${i}`,
        address: (i: number) => `123 Main St, City ${i}, State ${i} 12345`,
      }),
    },

    factories: {
      employee: Factory.extend({
        name: (i) => `Employee ${i}`,
        email: (i) => `employee${i}@example.com`,
        phoneNumber: (i) => `555555000${i}`,
        address: (i) => `123 Main St, City ${i}, State ${i} 12345`,
      }),
    },

    seeds(server) {
      // Seed your database with 10 employees
      server.createList("employee", 10);
    },

    routes() {
      this.namespace = "api";

      // Get all employees
      this.get("/employees", (schema: any) => {
        return schema.employees.all();
      });

      // Create a new employee
      this.post("/employees", (schema: any, request) => {
        const attrs = JSON.parse(request.requestBody);
        const employee = schema.employees.create(attrs);
        return new Response(
          201,
          {},
          { message: "Employee created successfully", employee }
        );
      });

      // Update an existing employee
      this.put("/employees/:id", (schema: any, request) => {
        const { id } = request.params;
        const attrs = JSON.parse(request.requestBody);
        const employee = schema.employees.find(id);
        if (employee) {
          const updatedEmployee = employee.update(attrs);
          return new Response(
            200,
            {},
            {
              message: "Employee updated successfully",
              employee: updatedEmployee,
            }
          );
        } else {
          return new Response(404, {}, { error: "Employee not found" });
        }
      });

      // Delete an employee
      this.delete("/employees/:id", (schema: any, request) => {
        const { id } = request.params;
        const employee = schema.employees.find(id);
        if (employee) {
          employee.destroy();
          return new Response(
            204,
            {},
            { message: "Employee deleted successfully" }
          );
        } else {
          return new Response(404, {}, { error: "Employee not found" });
        }
      });
    },
  });

  return server;
}
