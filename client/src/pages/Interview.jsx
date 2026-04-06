import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';

const Interview = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();

    return (
        <div className="h-screen w-full bg-gray-900 flex flex-col">
           
            <div className="bg-gray-800 p-4 flex justify-between items-center text-white shadow-md">
                <h1 className="text-xl font-bold">InsiderJobs Video Interview</h1>
                <button 
                    onClick={() => navigate(-1)} 
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    Leave & Go Back
                </button>
            </div>

           
            <div className="flex-1">
                <JitsiMeeting
                    domain="meet.jit.si"
                    roomName={`InsiderJobs-Interview-${id}`}
                    configOverwrite={{
                        startWithAudioMuted: true,
                        startWithVideoMuted: false,
                        disableModeratorIndicator: true,
                        enableEmailInStats: false,
                    }}
                    interfaceConfigOverwrite={{
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    }}
                    userInfo={{
                        displayName: 'Participant' 
                    }}
                    getIFrameRef={(iframeRef) => { 
                        iframeRef.style.height = '100%'; 
                        iframeRef.style.width = '100%'; 
                    }}
                />
            </div>
        </div>
    );
};

export default Interview;