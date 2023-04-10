const StellarAccount = ({ publicKey }: { publicKey: string }) => {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div>Account:</div>
      <div>{publicKey}</div>
    </div>
  );
};

export default StellarAccount;
