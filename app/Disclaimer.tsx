import React from 'react'

const Disclaimer = () => {
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-8 max-w-2xl mx-auto">
                    <h2 className="text-2xl font-bold mb-4 text-black">Disclaimer</h2>
                    <div className="text-gray-700 mb-6 space-y-4">
                        <p>Welcome to Topping Timer! Before you begin, please note:</p>
                        <ul className="list-disc pl-5">
                            <li>This application stores all uploaded images locally in your browser&apos;s storage on your own device. We do not collect, transmit, or store any user data or images on any server.</li>
                            <li>By using this application, you acknowledge that any content you upload is your sole responsibility. We are not liable for any illegal, harmful, or unauthorized content uploaded through this tool. Use responsibly and in accordance with applicable laws and regulations.</li>
                            <li>Your data is stored locally in your browser.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Disclaimer