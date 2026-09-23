import React from 'react'

const TerminalArrow = (props: React.ComponentProps<'span'>) => {
  return (
    <span {...props}>
      <svg width="18" height="29" viewBox="0 0 18 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.6724 16.0401L5.30959 28.3613C4.52422 29.2129 3.25426 29.2129 2.47725 28.3613L0.589026 26.3138C-0.196342 25.4622 -0.196342 24.0851 0.589026 23.2426L8.64322 14.5091L0.589026 5.77554C-0.196342 4.92393 -0.196342 3.54686 0.589026 2.70431L2.4689 0.638707C3.25426 -0.212902 4.52422 -0.212902 5.30123 0.638707L16.664 12.9599C17.4577 13.8115 17.4577 15.1885 16.6724 16.0401Z" fill="white"/>
      </svg>      
    </span>

  )
}

export default TerminalArrow