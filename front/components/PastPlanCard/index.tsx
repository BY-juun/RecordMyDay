import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import ScheduleIcon from "@material-ui/icons/Schedule";
import ListAltOutlinedIcon from "@material-ui/icons/ListAltOutlined";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import AddAlarmIcon from "@material-ui/icons/AddAlarm";
import { Plan } from "../../Types/common";
import { DayTitle, PastPlanWrapper } from "./styles";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: "#3f51b5",
    verticalAlign: "middle",
    marginRight: "10px",
    marginBottom: "3px",
  },
  totalTimediv: {
    marginTop: "20px",
    marginBottom: "10px",
  },
}));

interface Props {
  dayinfo: number;
  planList: Array<Plan | null>;
}

const PastPlanCard = ({ dayinfo, planList }: Props) => {
  const classes = useStyles();
  const [totaltime, setTotaltime] = useState(0);
  useEffect(() => {
    if (planList && planList?.length > 0) {
      setTotaltime(0);
      planList?.forEach((value, index) => {
        setTotaltime((prevTotaltime) => prevTotaltime + (value?.totaltime || 0));
      });
    }
  }, [planList]);

  return (
    <PastPlanWrapper>
      <DayTitle>{makeDateToString(dayinfo)}</DayTitle>
      {planList?.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ęłí</TableCell>
                <TableCell align="left">ěę°</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {planList &&
                planList.map((value, index) => (
                  <TableRow key={index}>
                    <TableCell align="left">
                      <ListAltOutlinedIcon className={classes.icon} />
                      {value?.content}
                    </TableCell>
                    <TableCell align="left">
                      <ScheduleIcon className={classes.icon} />
                      {value?.totaltime ? Math.floor(value?.totaltime / 60) + "ěę°" + (value.totaltime % 60) + "ëś" : "0"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        "ęłíě´ ěěľëë¤"
      )}
      {totaltime ? (
        <div className={classes.totalTimediv}>
          <AddAlarmIcon className={classes.icon} /> ě´ ěę° : {Math.floor(totaltime / 60)}ěę° {totaltime % 60}ëś
        </div>
      ) : null}
    </PastPlanWrapper>
  );
};

const makeDateToString = (dayinfo: number) => {
  let returnDate = String(dayinfo);
  return `${returnDate.substring(0, 4)}ë ${returnDate.substring(4, 6)}ě ${returnDate.substring(6, 8)}ěź`;
};

export default PastPlanCard;
