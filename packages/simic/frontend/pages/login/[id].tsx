import React, { useState, useLayoutEffect } from "react";
import{ useRouter } from "next/router";
import { SimicApiClient } from "../../src/api-client"
import { Typography } from "@material-ui/core"

const Index: React.FC = () => {
  const router = useRouter()
  const [error, setError] = useState(false)
  const id = router.query.id as string

  useLayoutEffect(() => {
    (async () => {
      if(id === undefined) {
        return 
      }
      try {
        let accessToken = localStorage.getItem("accessToken");
        let refreshToken = localStorage.getItem("refreshToken");

        const api = new SimicApiClient(process.env.APP_ENDPOINT, accessToken, refreshToken)
        if(!(accessToken && refreshToken)){
          let authorizeResponse = await api.authorize(id)
          localStorage.setItem("accessToken", authorizeResponse.accessToken)
          localStorage.setItem("refreshToken", authorizeResponse.refreshToken)
        }
        router.push("/")
      } catch(err) {
        setError(true)
      }
    })()
  }, [router.query])

  if(error) {
    return (
      <Typography>すでにアクセストークンが発行されています。この画面が出た場合は再度DiscordよりloginIdを発行してもらってください</Typography>
    )
  }
  return <></>
};

export default Index;
