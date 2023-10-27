
import { classNames } from '../helpers'
import {
  LinkIcon,

  ChevronRightIcon,

} from '@heroicons/react/solid'
import { useAppStore } from '../store/app'

type XmtpInfoRowProps = {
  icon: JSX.Element
  headingText: string
  subHeadingText: string
  onClick?: (() => void) | (() => Promise<void>)
  disabled?: boolean
}

type XmtpInfoPanelProps = {
  onConnect?: () => Promise<void>
}

const InfoRow = ({
  icon,
  headingText,

  onClick,
  disabled,
}: XmtpInfoRowProps): JSX.Element => (
  <a
    onClick={disabled ? undefined : onClick}
    className={disabled ? 'cursor-auto' : 'cursor-pointer'}
  >
    <div
      className={classNames(
        disabled ? 'opacity-40' : '',
        'flex py-4 border border-x-0 border-y-zinc-50 justify-between items-stretch text-left'
      )}
    >
      <div className="h-10 w-10 bg-l-300 rounded-lg text-white p-2">{icon}</div>
      <div className="ml-3 flex-col justify-center text-md flex-1">
        <div className="font-semibold text-n-600 pt-2">{headingText}</div>

      </div>
      <div className="w-10 flex justify-end items-center pr-2">
        <ChevronRightIcon className="h-5" />
      </div>
    </div>
  </a>
)

const XmtpInfoPanel = ({ onConnect }: XmtpInfoPanelProps): JSX.Element => {
  const walletAddress = useAppStore((state) => state.address)
  const InfoRows = [
    {
      icon: <LinkIcon />,
      headingText: 'Connect your wallet',
      subHeadingText: '',
      onClick: onConnect,
      disabled: !!walletAddress,
    },


  ]

  return (
    // The info panel is only shown in desktop layouts.
    <div className="hidden md:block   m-auto w-[464px]" >
      <div className="pb-6">
        <div className="text-xl text-n-600 font-semibold mb-1">
        Connect the Wallet
        </div>
        <div className="text-md text-n-300">
          Get started by reading the docs or joining the community
        </div>
      </div>
      <div>
        {InfoRows.map((info, index) => {
          return (
            <InfoRow
              key={index}
              icon={info.icon}
              headingText={info.headingText}
              subHeadingText={info.subHeadingText}
              onClick={info.onClick}
              disabled={info.disabled}
            />
          )
        })}
      </div>
     
    </div>
  )
}

export default XmtpInfoPanel
