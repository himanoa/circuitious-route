import React, { useState, useCallback, useEffect } from "react";
import{ useRouter } from "next/router";
import dynamic from "next/dynamic";
import { SimicApiClient } from "../../src/api-client"
import { Typography } from "@material-ui/core"

const Index: React.FC = () => {
  const router = useRouter()
  const [error, setError] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        let accessToken = localStorage.getItem("accessToken");
        let refreshToken = localStorage.getItem("refreshToken");

        const api = new SimicApiClient(process.env.APP_ENDPOINT, accessToken, refreshToken)
        if(!(accessToken && refreshToken)){
          let { accessToken, refreshToken } = await api.authorize(router.query.id as string)
          localStorage.setItem("accessToken", accessToken)
          localStorage.setItem("refreshToken", refreshToken)
        }
        router.push("/")
      } catch(err) {
        setError(true)
      }
    })()
  }, [])

  if(error) {
    return (
      <Typography>すでにアクセストークンが発行されています。この画面が出た場合は再度DiscordよりloginIdを発行してもらってください</Typography>
    )
  }
  return <></>
};

export default Index;
