import { config } from "@/config";
import {
  Connector,
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from "wagmi";
import { getAccount, signMessage } from "@wagmi/core";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  const signCustomMessage = async () => {
    const { connector } = getAccount(config);
    const message = "Hello, world!";
    console.log("Signing message:", message);
    try {
      const signature = await signMessage(config, { connector, message });
      console.log(signature);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="text-white flex flex-col justify-center items-center">
      <div className="flex flex-row justify-center items-center gap-4">
        {/* <button
          onClick={() => signCustomMessage()}
          className="text-white flex justify-center items-center bg-[#22c55e] hover:bg-[#22c55e] rounded-lg px-4 py-2"
        >
          Verify
        </button> */}
        <button
          onClick={() => disconnect()}
          className="text-white flex justify-center items-center bg-[#22c55e] hover:bg-[#22c55e] rounded-lg px-4 py-2"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
