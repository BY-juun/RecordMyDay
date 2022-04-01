import React, { useCallback, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { MuiPickersUtilsProvider, KeyboardTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import AlarmOnIcon from "@material-ui/icons/AlarmOn";
import { Plan } from "../../Types/today";
import { useDeletePlanMutation } from "../../_Query/today";
import { PlanCard } from "./styles";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "15px",
  },
  timepicker: {
    width: "140px",
    marginLeft: "10px",
    marginRight: "10px",
  },
  button: {
    marginTop: "15px",
    marginBottom: "15px",
    marginLeft: "15px",
    marginRight: "15px",
  },
  chip: {
    marginLeft: "80px",
  },
  totlatimeDiv: {
    marginTop: "10px",
    marginBottom: "20px",
  },
  clearIcon: {
    color: "#3f51b5",
  },
  snackbar: {
    marginBottom: "70px",
  },
}));

interface Props {
  plan: Plan;
}

const PlanList = ({ plan }: Props) => {
  const classes = useStyles();
  const [startTime, setStartTime] = useState(plan.starttime);
  const [endTime, setEndTime] = useState(plan.endtime);
  const deletePlanMutation = useDeletePlanMutation();
  // const {deletePlanDone} = useSelector((state)=>state.plan);

  // useEffect(()=>{
  //     if(deletePlanDone){
  //         Router.push('/Today');
  //     }
  // },[deletePlanDone])

  const onChangeStartTime = useCallback(
    (date) => {
      setStartTime(date);
    },
    [startTime]
  );

  const onChangeEndTime = useCallback(
    (date) => {
      setEndTime(date);
    },
    [endTime]
  );

  const submitTime = useCallback(() => {
    let totaltime = null;
    if (startTime) {
      if (endTime) {
        if (startTime > endTime) {
          setStartTime(plan.starttime);
          setEndTime(plan.endtime);
          alert("*시간 설정이 잘못되었습니다");
          return;
        }
        totaltime =
          new Date(endTime).getHours() * 60 + new Date(endTime).getMinutes() - (new Date(startTime).getHours() * 60 + new Date(startTime).getMinutes());
        if (totaltime <= 0) {
          alert("*시간은 오늘 24시 안으로 설정해주세요.");
        }
      }
    }
    // return dispatch({
    //     type: SUBMIT_TIME_REQUEST,
    //     data: {
    //         startTime, endTime, totaltime, id
    //     }
    // })
  }, [startTime, endTime]);

  const onClickDelete = useCallback(() => {
    deletePlanMutation.mutate(plan.id);
  }, [deletePlanMutation]);

  return (
    <>
      <PlanCard>
        {plan.totaltime ? (
          <Chip label={plan.content} className={classes.root} color="primary" variant="outlined" />
        ) : (
          <Chip label={plan.content} className={classes.root} variant="outlined" />
        )}
        <div>
          {plan.endtime ? (
            <div className={classes.totlatimeDiv}>
              <AlarmOnIcon className={classes.clearIcon} />
              <div>
                수행시간 : {Math.floor(plan.totaltime / 60)}시간 {plan.totaltime % 60}분
              </div>
            </div>
          ) : (
            <>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker"
                  label="시작 시간"
                  className={classes.timepicker}
                  KeyboardButtonProps={{
                    "aria-label": "change time",
                  }}
                  value={startTime}
                  onChange={onChangeStartTime}
                />
                <KeyboardTimePicker
                  margin="normal"
                  className={classes.timepicker}
                  id="time-picker"
                  label="마무리 시간"
                  KeyboardButtonProps={{
                    "aria-label": "change time",
                  }}
                  value={endTime}
                  onChange={onChangeEndTime}
                />
              </MuiPickersUtilsProvider>
            </>
          )}
        </div>
        {plan.starttime && plan.endtime && plan.totaltime ? null : (
          <>
            <Button variant="outlined" color="secondary" className={classes.button} onClick={onClickDelete}>
              삭제
            </Button>
            <Button variant="outlined" color="primary" className={classes.button} onClick={submitTime}>
              제출
            </Button>
          </>
        )}
      </PlanCard>
    </>
  );
};

export default PlanList;