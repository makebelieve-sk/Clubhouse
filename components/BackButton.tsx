import React from "react";
import Link from "next/link";

type BackButtonProps = {
    title: string,
    href: string
}

export const BackButton: React.FC<BackButtonProps> = ({title, href}) => (
    <Link href={href}>
        <div className="d-flex mb-30 cup">
            <img src="" alt="Back" className="mr-10" />
            <h3>{title}</h3>
        </div>
    </Link>
)