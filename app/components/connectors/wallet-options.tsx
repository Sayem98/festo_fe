import * as React from "react";
import { Connector, useConnect } from "wagmi";
import { getAccount, signMessage } from "@wagmi/core";
import { config } from "@/config";

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  const signCustomMessage = async () => {
    const { connector } = getAccount(config);
    const message = "Hello, world!";
    console.log("Signing message:", message);
    const signature = await signMessage(config, { connector, message });
    console.log(signature);
  };

  return (
    <div className="flex justify-center items-center">
      {connectors.map(
        (connector) =>
          connector.type === "metaMask" && (
            <WalletOption
              key={connector.uid}
              connector={connector}
              onClick={() => connect({ connector })}
            />
          )
      )}
    </div>
  );
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <button
      disabled={!ready}
      onClick={onClick}
      className="text-white flex justify-center items-center bg-[#22c55e] hover:bg-[#22c55e] rounded-lg px-4 py-2"
    >
      {connector.name}
    </button>
  );
}
