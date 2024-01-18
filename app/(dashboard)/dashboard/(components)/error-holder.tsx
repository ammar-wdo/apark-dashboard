import React from 'react'

type Props = {}

const ErrorHolder = (props: Props) => {

  
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <p className="text-center text-rose-500 text-2xl font-semibold">
          This account is not valid!
          <br />
          Please contact Aparking admin
        </p>
      </div>
    );
  
}

export default ErrorHolder