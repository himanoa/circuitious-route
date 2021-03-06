import React, { useState, useCallback, useEffect } from "react";
import { SimicApiClient } from "../src/api-client";
import {
  Button,
  ButtonGroup,
  Grid,
  Paper,
  FormControl,
  TextField,
  Typography,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  commentPaper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));
const Index: React.FC = () => {
  const classes = useStyles();

  const [pageLoading, setPageLoading] = useState(true);
  const [streamKey, setStreamKey] = useState("");

  const handleStreamKeyInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setStreamKey(e.target.value),
    []
  );
  const handleStreamKeySubmit = useCallback(() => {
    (async () => {
      const api = new SimicApiClient(
        process.env.APP_ENDPOINT,
        window.localStorage.getItem("accessToken"),
        window.localStorage.getItem("refreshToken")
      );
      await api.upsertProfile([{ streamKey: streamKey }]);
    })();
  }, [streamKey]);

  const handleStartStreamingSubmit = useCallback(() => {
    (async () => {
      const api = new SimicApiClient(
        process.env.APP_ENDPOINT,
        window.localStorage.getItem("accessToken"),
        window.localStorage.getItem("refreshToken")
      );
      await api.startStreaming();
    })();
  }, [streamKey]);


  useEffect(() => {
    let socket: WebSocket | null = null;
    (async () => {
      const api = new SimicApiClient(
        process.env.APP_ENDPOINT,
        window.localStorage.getItem("accessToken"),
        window.localStorage.getItem("refreshToken")
      );
      const { profiles } = await api.verify();
      console.dir(profiles);
      if (profiles.length !== 0) {
        setStreamKey(profiles[0].streamKey);
      }
      setPageLoading(false);

      socket = new WebSocket(process.env.PUBSUB_ENDPOINT)
      socket.onopen = () => {
        if(socket) {
          socket.send(JSON.stringify({
            type: "start-subscribe",
            payload: {
              discordId: profiles[0].discordId
            }
          }))
        }
      }
    })();
    return () => {
      if(socket) {
        socket.close()
      }
    }
  }, []);

  if (pageLoading) {
    return (
      <div>
        <Grid container justify="center" alignItems="center">
          <CircularProgress />
        </Grid>
      </div>
    );
  }

  const LeftPane: React.FC = () => {
    return (
      <Grid
        container
        item
        xs={8}
        justify="center"
        alignContent="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <p>no content</p>
        </Grid>
      </Grid>
    );
  };

  const RightPane: React.FC = () => {
    return (
      <Grid
        container
        item
        xs={4}
        justify="center"
        alignContent="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <Paper className={classes.paper}>
            <Grid
              container
              spacing={10}
              justify="center"
              direction="column"
              alignItems="center"
            >
              <Grid item direction="column">
                <FormControl>
                  <TextField
                    label="ストリームキー"
                    onChange={handleStreamKeyInputChange}
                    value={streamKey}
                  ></TextField>
                </FormControl>
              </Grid>
              <Grid item>
                <ButtonGroup>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleStreamKeySubmit}
                  >
                    ストリームキーの設定の保存
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={handleStartStreamingSubmit}
                  >
                    配信の開始
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item spacing={10}>
          <Paper className={classes.commentPaper}>
            <Grid container spacing={5} direction="column">
              <Grid item>
                <Typography variant="subtitle1" component="h2">
                  コメント
                </Typography>
              </Grid>
              <Grid item>
                <Typography>
                  配信が開始されたらここにコメントが流れます。
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <LeftPane />
        <RightPane />
      </Grid>
    </div>
  );
};

export default Index;
