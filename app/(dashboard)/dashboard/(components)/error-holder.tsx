import React from 'react'

type Props = {}

const ErrorHolder = (props: Props) => {

  
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <p className="text-rose-400 text-4xl font-bold text-center mb-24">
          This account is not valid!
          <br />
          Please contact Aparking admin
        </p>
      </div>
    );
  
}

export default ErrorHolder