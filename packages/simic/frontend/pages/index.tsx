import React from "react";
import {
  Button,
  ButtonGroup,
  Grid,
  Paper,
  FormControl,
  TextField,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));
const Index: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
        alignContent="center"
        alignItems="center"
        direction="column"
      >
        <Paper className={classes.paper} >
          <Grid container spacing={10} justify="center" direction="column">
            <Grid item direction="column">
              <FormControl>
                <TextField label="ストリームキー"></TextField>
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
    </div>
  );
};

export default Index;
