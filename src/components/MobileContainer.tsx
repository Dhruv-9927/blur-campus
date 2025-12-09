import React from 'react'


export default function MobileContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1614] to-[#2d2420] flex items-center justify-center relative overflow-hidden">

            {/* Desktop Background Elements */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#d4a373] rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8c817c] rounded-full blur-[128px] translate-x-1/2 translate-y-1/2" />
            </div>



            {/* Mobile Container */}
            <div className="w-full max-w-[450px] h-full min-h-screen bg-[#fdfbf7] shadow-2xl relative overflow-x-hidden flex flex-col">
                {children}
            </div>
        </div>
    )
}
