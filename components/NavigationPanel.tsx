import { LinkIcon } from '@heroicons/react/outline'
import { ArrowSmRightIcon } from '@heroicons/react/solid'
import { useAppStore } from '../store/app'
import ConversationsList from './ConversationsList'
import Loader from './Loader'

import '.././styles/mystyles.module.css'
import { GroupSvg, MessageSvg, PeopleSvg, SettingSvg } from './svgs'


type NavigationPanelProps = {
  onConnect: () => Promise<void>
}

type ConnectButtonProps = {
  onConnect: () => Promise<void>
}

const NavigationPanel = ({ onConnect }: NavigationPanelProps): JSX.Element => {
  const walletAddress = useAppStore((state) => state.address)
  const client = useAppStore((state) => state.client)

  return (
    <div className="flex-grow flex flex-col h-[calc(100vh-8rem)] overflow-y-auto">
      {walletAddress && client !== null ? (
        <>
          <ConversationsPanel />
        </>
      ) : (
        <NoWalletConnectedMessage>
          <ConnectButton onConnect={onConnect} />
        </NoWalletConnectedMessage>
      )}
    </div>
  )
}

const NoWalletConnectedMessage: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-col flex-grow justify-center">
      <div className="flex flex-col items-center px-4 text-center">
        <LinkIcon
          className="h-8 w-8 mb-1 stroke-n-200 md:stroke-n-300"
          aria-hidden="true"
        />
        <p className="text-xl md:text-lg text-n-200 md:text-n-300 font-bold">
          No wallet connected
        </p>
        <p className="text-lx md:text-md text-n-200 font-normal">
          Please connect a wallet to begin
        </p>
      </div>
      {children}
    </div>
  )
}

const ConnectButton = ({ onConnect }: ConnectButtonProps): JSX.Element => {
  return (
    <button
      onClick={onConnect}
      className="rounded border border-l-300 mx-auto my-4 text-l-300 hover:text-white hover:bg-l-400 hover:border-l-400 hover:fill-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-n-100 focus-visible:outline-none active:bg-l-500 active:border-l-500 active:text-l-100 active:ring-0"
    >
      <div className="flex items-center justify-center text-xs font-semibold px-4 py-1">
        Connect your wallet
        <ArrowSmRightIcon className="h-4" />
      </div>
    </button>
  )
}

const ConversationsPanel = (): JSX.Element => {
  const client = useAppStore((state) => state.client)
  const loadingConversations = useAppStore(
    (state) => state.loadingConversations
  )

  if (client === undefined) {
    return (
      <Loader
        headingText="Awaiting signatures..."
        subHeadingText="Use your wallet to sign"
        isLoading
      />
    )
  }

  if (loadingConversations) {
    return (
      <Loader
        headingText="Loading conversations..."
        subHeadingText="Please wait a moment"
        isLoading
      />
    )
  }

  return (
    <nav className="flex-1 pb-4">
      <div
        style={{
          display: 'flex',
          overflow: 'none',
        }}
      >
        <div
          style={{
            boxShadow: '6px 0px 10px -3px rgba(0,0,0,0.1)',
            
            width: '70px',
            zIndex:"1",
            height: '80.6vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            flexDirection: 'column',
          }}
        >
  

          <MessageSvg className="text-2xl mb-5 "  />


       
          <PeopleSvg className="text-2xl mb-5" />
     
          <GroupSvg className="text-2xl mb-5" />

          <SettingSvg className="text-2xl" />
        </div>

        <div
          style={{
            backgroundColor: '#F5F7FB',
            height: '80.6vh',
          }}
        >
          <ConversationsList />
        </div>
      </div>
    </nav>
  )
}

export default NavigationPanel
