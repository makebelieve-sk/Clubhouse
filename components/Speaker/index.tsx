// Комопнент человека, зашедшего в комнату
import React from "react";
import {Avatar} from "../Avatar";

export type SpeakerProps = {
    fullName?: string,
    avatarUrl?: string,
}

export const Speaker: React.FC<SpeakerProps> = ({fullName, avatarUrl}) => {
    return (
        <div className="d-i-flex flex-column align-items-center mr-40 mb-40">
            <Avatar src={avatarUrl} height="100px" width="100px"/>

            <div className="mt-20">
                <b>{fullName}</b>
            </div>
        </div>
    )
}