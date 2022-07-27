import App from "./App";
import DevTools from "../DevTools";
import { useWorker } from "../useWorker";
import { DevToolsConfig, MockUser } from "./types";
import Input from "./Input";
import Select from "./Select";
import { mockUsers } from "./mocks/users.mocks";
import useLocalStorageState from "use-local-storage-state";
import ErrorBoundary from "./ErrorBoundary";

const devToolsConfigDefaults: DevToolsConfig = {
  user: mockUsers[0],
  apiResponse: {
    addTodo: {
      delay: 0,
      status: 200,
    },
    getTodos: {
      delay: 0,
      status: 200,
    },
    markTodoCompleted: {
      delay: 0,
      status: 200,
    },
  },
  delay: 0,
};

export default function AppWithDevTools() {
  const [devToolsConfig, setDevToolsConfig] = useLocalStorageState("devtools", {
    defaultValue: devToolsConfigDefaults,
  });
  const isReady = useWorker(devToolsConfig);

  if (!isReady) return <p>Initializing Mock Service Worker...</p>;

  return (
    <>
      {/* Wrap app in ErrorBoundary so devtools continue to display upon error */}
      <ErrorBoundary>
        <App user={devToolsConfig.user} />
      </ErrorBoundary>
      <DevTools>
        <div className="mt-4">
          <Select
            id="user"
            label="User"
            value={devToolsConfig.user.id}
            onChange={(e) => {
              const newUser = mockUsers.find(
                (u) => u.id === parseInt(e.target.value)
              ) as MockUser;
              setDevToolsConfig({ ...devToolsConfig, user: newUser });
            }}
          >
            {mockUsers.map((u) => (
              <option value={u.id} key={u.id}>
                {u.name} ({u.description})
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-4">
          <Input
            type="number"
            label="Global Delay (ms)"
            value={devToolsConfig.delay}
            onChange={(e) =>
              setDevToolsConfig({
                ...devToolsConfig,
                delay: parseInt(e.target.value),
              })
            }
          />
        </div>

        <h2 className="mt-4 font-bold">HTTP responses</h2>

        <fieldset className="mt-4 border p-4">
          <legend>getTodos</legend>
          <div className="flex flex-row">
            <Input
              type="number"
              label="Delay"
              className="w-20 mr-4"
              value={devToolsConfig.apiResponse.getTodos.delay}
              onChange={(e) => {
                setDevToolsConfig({
                  ...devToolsConfig,
                  apiResponse: {
                    ...devToolsConfig.apiResponse,
                    getTodos: {
                      ...devToolsConfig.apiResponse.getTodos,
                      delay: parseInt(e.target.value),
                    },
                  },
                });
              }}
            />

            <Input
              type="number"
              label="Status"
              className="w-20"
              value={devToolsConfig.apiResponse.getTodos.status}
              onChange={(e) => {
                setDevToolsConfig({
                  ...devToolsConfig,
                  apiResponse: {
                    ...devToolsConfig.apiResponse,
                    getTodos: {
                      ...devToolsConfig.apiResponse.getTodos,
                      status: parseInt(e.target.value),
                    },
                  },
                });
              }}
            />
          </div>
        </fieldset>
      </DevTools>
    </>
  );
}
