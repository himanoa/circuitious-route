import React, { useState, useCallback } from "react";
import {
  Button,
  ButtonGroup,
  Grid,
  Paper,
  FormControl,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
  const [streamKey, setStreamKey] = useState("")
  const handleStreamKeyInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setStreamKey(e.target.value), [])

  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
        alignContent="center"
        alignItems="center"
        direction="column"
        spacing={10}
      >
        <Grid item>
          <Paper className={classes.paper} >
            <Grid container spacing={10} justify="center" direction="column" alignItems="center">
              <Grid item direction="column">
                <FormControl>
                  <TextField label="ストリームキー" onChange={handleStreamKeyInputChange} value={streamKey}></TextField>
                </FormControl>
              </Grid>
              <Grid item>
                <ButtonGroup>
                  <Button color="primary" variant="contained">
                    ストリームキーの設定の保存
                  </Button>
                  <Button color="secondary" variant="contained">
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
                <Typography variant="subtitle1" component="h2">コメント</Typography>
              </Grid>
              <Grid item>
                <Typography>配信が開始されたらここにコメントが流れます。</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Index;
