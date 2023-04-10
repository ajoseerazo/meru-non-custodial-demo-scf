import { useCallback } from "react";

const AccountActions = (props: any) => {
  const logout = useCallback(() => {
    localStorage.clear();

    if (props.onExit) {
      props.onExit();
    }
  }, []);

  return (
    <div className="flex flex-row">
      <button className="bg-blue-600 rounded-lg text-white px-6 py-2 shadow-lg mr-4">
        Send Payment
      </button>

      <button
        className="bg-blue-600 rounded-lg text-white px-6 py-2 shadow-lg"
        onClick={logout}
      >
        Exit
      </button>
    </div>
  );
};

export default AccountActions;
