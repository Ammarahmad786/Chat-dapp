import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import AddressInput from '../AddressInput'
import { isEns, getAddressFromPath, is0xAddress } from '../../helpers'
import { useAppStore } from '../../store/app'
import useWalletProvider from '../../hooks/useWalletProvider'
import BackArrow from '../BackArrow'

const RecipientInputMode = {
  InvalidEntry: 0,
  ValidEntry: 1,
  FindingEntry: 2,
  Submitted: 3,
  NotOnNetwork: 4,
}

const RecipientControl = (): JSX.Element => {
  const { resolveName, lookupAddress } = useWalletProvider()
  const client = useAppStore((state) => state.client)
  const router = useRouter()
  const recipientWalletAddress = getAddressFromPath(router)
  const [recipientInputMode, setRecipientInputMode] = useState(
    RecipientInputMode.InvalidEntry
  )
  const [hasName, setHasName] = useState(false)

  const checkIfOnNetwork = useCallback(
    async (address: string): Promise<boolean> => {
      return client?.canMessage(address) || false
    },
    [client]
  )

  const onSubmit = async (address: string) => {
    router.push(address ? `/dm/${address}` : '/dm/')
  }

  const handleBackArrowClick = useCallback(() => {
    router.push('/')
  }, [router])

  const completeSubmit = async (address: string, input: HTMLInputElement) => {
    if (await checkIfOnNetwork(address)) {
      onSubmit(address)
      input.blur()
      setRecipientInputMode(RecipientInputMode.Submitted)
    } else {
      setRecipientInputMode(RecipientInputMode.NotOnNetwork)
    }
  }

  useEffect(() => {
    const handleAddressLookup = async (address: string) => {
      const name = await lookupAddress(address)
      setHasName(!!name)
    }
    if (recipientWalletAddress && !isEns(recipientWalletAddress)) {
      setRecipientInputMode(RecipientInputMode.Submitted)
      handleAddressLookup(recipientWalletAddress)
    } else {
      setRecipientInputMode(RecipientInputMode.InvalidEntry)
    }
  }, [lookupAddress, recipientWalletAddress])

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent, value?: string) => {
      e.preventDefault()
      const data = e.target as typeof e.target & {
        recipient: { value: string }
      }
      const input = e.target as HTMLInputElement
      const recipientValue = value || data.recipient.value
      if (isEns(recipientValue)) {
        setRecipientInputMode(RecipientInputMode.FindingEntry)
        const address = await resolveName(recipientValue)
        if (address) {
          await completeSubmit(address, input)
        } else {
          setRecipientInputMode(RecipientInputMode.InvalidEntry)
        }
      } else if (is0xAddress(recipientValue)) {
        await completeSubmit(recipientValue, input)
      }
    },
    [resolveName]
  )

  const handleInputChange = useCallback(
    async (e: React.SyntheticEvent) => {
      const data = e.target as typeof e.target & {
        value: string
      }
      if (router.pathname !== '/dm') {
        router.push('/dm')
      }
      if (isEns(data.value) || is0xAddress(data.value)) {
        handleSubmit(e, data.value)
      } else {
        setRecipientInputMode(RecipientInputMode.InvalidEntry)
      }
    },
    [handleSubmit, router]
  )

  return (
    <>
      <div className="md:hidden flex items-center ml-3">
        <BackArrow onClick={handleBackArrowClick} />
      </div>
      <div className="flex-1 flex-col shrink justify-center flex bg-zinc-50 md:border-b md:border-gray-200 md:px-4 md:pb-[2px]" style={{
        backgroundColor:"white"
      }}>
        <form
          className="w-full flex pl-2 md:pl-0 h-8 pt-1"
          action="#"
          method="GET"
          onSubmit={handleSubmit}
        >
          <label htmlFor="recipient-field" className="sr-only">
            Recipient
          </label>
         
          <div className="relative w-full text-n-300 focus-within:text-n-600">
            <div className="absolute top-2 left-0 flex items-center pointer-events-none text-md md:text-sm font-medium md:font-semibold" style={{
              zIndex:"2"
            }}>
              To:
              
            </div>
         
            <AddressInput
              recipientWalletAddress={recipientWalletAddress}
              id="recipient-field"
              className="block w-[95%] pl-7 md:ms-[3px] pr-3 pt-[3px] md:pt-[2px] md:pt-[5px] bg-transperant caret-n-600 text-n-600 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent text-lg font-mono"
              name="recipient"
              onInputChange={handleInputChange}
            />
           
            {/* <i className="ri-record-circle-fill font-size-10 text-success d-inline-block ms-2"></i> */}
            {/* <img src="/search.png" alt="" style={{
              position:"absolute",
              top:"-8px",
              left:"720px",
              height:"55px",
              cursor:"pointer"

            }}/>
             <img src="/phoneall.png" alt="" style={{
              position:"absolute",
              top:"10px",
              color:"black",
              left:"805px",
              height:"18px",
              cursor:"ponter"

            }}/> <img src="/video.png" alt="" style={{
              position:"absolute",
              top:"0px",
              left:"860px",
              height:"40px",

            }}/>
            <img src="/peopleicon.png" alt="" style={{
              position:"absolute",
              top:"6px",
              left:"925px",
              height:"26px",

            }}/>
            <img src="/video.png" alt="..." style={{
              position:"absolute",
              top:"0px",
              left:"860px",
              height:"40px",

            }} />
            <img  src="/dots.png" style={{
              position:"absolute",
              top:"-16px",
              left:"970px",
              height:"70px",

            }} /> */}
            </div>
            <button type="submit" className="hidden" />

          
        </form>

        {recipientInputMode === RecipientInputMode.Submitted ? (
          <div className="text-md text-n-300 text-sm font-mono ml-10 md:ml-8 pb-1 md:pb-[1px]">
            {hasName ? recipientWalletAddress : <br />}
          </div>
        ) : (
          <div className="text-sm md:text-xs text-n-300 ml-[29px] pl-2 md:pl-0 pb-1 md:pb-[3px]">
            {recipientInputMode === RecipientInputMode.NotOnNetwork &&
              'Recipient is not on the XMTP network'}
            {recipientInputMode === RecipientInputMode.FindingEntry &&
              'Finding ENS domain...'}
            {recipientInputMode === RecipientInputMode.InvalidEntry &&
              'Please enter a valid wallet address'}
            {recipientInputMode === RecipientInputMode.ValidEntry && <br />}
          </div>
        )}
      </div>
    </>
  )
}

export default RecipientControl
