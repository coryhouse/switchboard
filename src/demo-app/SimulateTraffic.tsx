import Button from "../components/Button";
import { addTodo, deleteTodo } from "./apis/todo-apis";
import Input from "../components/Input";
import { useState } from "react";
import Field from "../components/Field";
import Select from "../components/Select";

type SimulateAction = "add" | "edit" | "delete";

export function SimulateTraffic() {
  const [simulateAction, setSimulateAction] = useState<SimulateAction>("add");
  const [simulateAdd, setSimulateAdd] = useState("");
  const [simulateDelete, setSimulateDelete] = useState("");

  return (
    <details className="mt-4" open>
      <summary className="font-bold">Simulate Traffic</summary>
      <Field>
        <Select
          label="Action"
          value={simulateAction}
          onChange={(e) => {
            setSimulateAction(e.target.value as SimulateAction);
          }}
        >
          <option value="add">Add</option>
          <option value="delete">Delete</option>
          <option value="edit">Edit</option>
        </Select>
      </Field>

      {simulateAction === "add" && (
        <Field>
          <Input
            label="Todo"
            value={simulateAdd}
            id="simulate-add"
            onChange={(e) => setSimulateAdd(e.target.value)}
          />
          <Button
            onClick={() => {
              addTodo(simulateAdd);
            }}
          >
            Add
          </Button>
        </Field>
      )}

      {simulateAction === "delete" && (
        <Field>
          <Input
            label="Todo Id"
            value={simulateDelete}
            type="number"
            id="simulate-delete"
            onChange={(e) => setSimulateDelete(e.target.value)}
          />
          <Button
            onClick={() => {
              if (!simulateDelete) return;
              deleteTodo(parseInt(simulateDelete));
              setSimulateDelete("");
            }}
          >
            Delete
          </Button>
        </Field>
      )}
    </details>
  );
}
