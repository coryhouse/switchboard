import React, { Dispatch, SetStateAction } from "react";
import { mockPersonas } from "./mocks/data/personas.mocks";
import useUserSync from "./useUserSync";
import Field from "../components/Field";
import Select from "../components/Select";

type UserProps = {
  userId: number | "";
  setUserId: Dispatch<SetStateAction<number | "">>;
};

export function User({ userId, setUserId }: UserProps) {
  useUserSync(userId, setUserId);

  return (
    <Field>
      <Select
        width="full"
        id="user"
        label="Persona"
        value={userId}
        onChange={(e) => {
          setUserId(e.target.value ? parseInt(e.target.value) : "");
        }}
      >
        <option value="">Logged out</option>
        {mockPersonas.map(({ id, description, response }) => (
          <option value={id} key={id}>
            {response.name} ({description.role}, {description.todos})
          </option>
        ))}
      </Select>
    </Field>
  );
}
