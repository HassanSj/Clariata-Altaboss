import { useRouter } from "next/router";
import React from "react";
import { getAccessToken } from "~/services/auth";

const LoginConfirm = () => {

    const router = useRouter();

    router.push('/advisor')


    return (
        <>
            Succesful login!! - {getAccessToken()}
        </>
    )
}

export default LoginConfirm;