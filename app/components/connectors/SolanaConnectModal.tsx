import React from 'react';

import ConnectButton from '../buttons/ConnectButton';
import { useWalletModal, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import "@solana/wallet-adapter-react-ui/styles.css"
type Props = {
    title: string;
    icon: string;
};

const SolanaConnectModal: React.FC<Props> = ({ title, icon }) => {
    const { setVisible } = useWalletModal();

    const openModal = () => {
        setVisible(true);
    };

    return (
        <> 
        <div className="bg-white">
        < WalletMultiButton/>
        </div>
        
            {/* <ConnectButton title={title} icon={icon} callback={openModal} /> */}
        </>
    );
};

export default SolanaConnectModal;
