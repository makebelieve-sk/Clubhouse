import React from "react";
import {useRouter} from "next/router";

import {Profile} from "../../components/Profile";
import {Header} from "../../components/Header";

export default function ProfilePage() {
    const router = useRouter();

    // Получаем данные из юрл адреса
    const {id} = router.query;

    return (
        <>
            <Header />

            <div className="container mt-30">
                <Profile
                    fullname="Scriabin Alexey"
                    username="scriabin"
                    avatarUrl="../../../public/favicon.ico"
                    about="Kakaya to vaznay infa  Kakaya to vaznay infa  Kakaya to vaznay infa  Kakaya to vaznay infa"
                />
            </div>
        </>
    )
}