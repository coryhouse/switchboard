import { mockPersonas } from "../mocks/data/personas.mocks";
import useSyncSwitchboardWithUserContext from "./useUserSync";
import Field from "../../components/Field";
import Select from "../../components/Select";

type UserProps = {
  userId: number | null;
  setUserId: (value: number | null) => void;
};

export function User({ userId, setUserId }: UserProps) {
  useSyncSwitchboardWithUserContext(userId, setUserId);

  return (
    <Field>
      <Select
        width="full"
        id="user"
        label="Persona"
        value={userId ? userId.toString() : ""}
        onChange={(e) =>
          setUserId(e.target.value ? parseInt(e.target.value) : null)
        }
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
