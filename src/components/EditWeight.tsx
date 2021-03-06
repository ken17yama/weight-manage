import React, { useState, useEffect, useContext } from "react";
import { ListContext, TargetContext, EditModalContext } from './WeightList';

import axios from 'axios'
import moment from 'moment'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import Button from '@material-ui/core/Button';

import PostAddIcon from '@material-ui/icons/PostAdd';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers';

import authHeader from '../services/auth-header';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
			flexWrap: 'wrap',
		},
		textField: {
			textAlign: 'center',
		},
		inputAdornment: {
			width: '2em'
		},
		insideBox: {
			marginTop: '10px'
		}
	}),
);

interface Results {
	weight: number,
	bodyFat: number,
	subcutaneousFat: number,
	recordDate: any
}

const EditWeight = () => {

	const [weights, setWeights] = useContext(ListContext);
	const targetContext = useContext(TargetContext);
	const [editModal, setEditModal] = useContext(EditModalContext);

	const [weight, setWeight] = useState(0);
	const [bodyFat, setBodyFat] = useState(0);
	const [subcutaneousFat, setSubcutaneousFat] = useState(0);
	const [selectedDate, setSelectedDate] = useState<Date | null>(
		new Date(),
	);

	const handleDateChange = (date: Date | null) => {
		setSelectedDate(date);
	};

	const ROOT_URL = "http://localhost:8080"

	const fetchData = async () => {
		const res = await axios.get(`${ROOT_URL}/api/weight`, { headers: authHeader() })
		res.data.forEach((item: any, index: number) => {
			res.data[index].recordDate = item.recordDate.substring(0, item.recordDate.indexOf("T"))
		})
		setWeights(res.data)
	}

	const editWeight = async (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const data: Results = {
			weight: weight,
			bodyFat: bodyFat,
			subcutaneousFat: subcutaneousFat,
			recordDate: moment(selectedDate).format('YYYY-MM-DD')
		}
		await axios.put(`${ROOT_URL}/api/weight/${targetContext.id}`, data, {
			headers: authHeader()
		})
		await setEditModal(false)
		await fetchData()
	}

	useEffect(() => {
		setWeight(targetContext.weight)
		setBodyFat(targetContext.bodyFat)
		setSubcutaneousFat(targetContext.subcutaneousFat)
		setSelectedDate(new Date(targetContext.recordDate))
	}, [targetContext]);

	const classes = useStyles();

	return (
		<React.Fragment>
			<form className={classes.root} method="post">
				<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" alignContent="center" width={1}>
					<Box>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Grid container justify="space-around">
								<KeyboardDatePicker
									disableToolbar
									autoOk
									variant="inline"
									format="yyyy/MM/dd"
									margin="normal"
									label="計測日"
									value={selectedDate}
									onChange={handleDateChange}
									invalidDateMessage='正しい日付を入力してください。'
									KeyboardButtonProps={{
										'aria-label': 'change date',
									}}
								/>
							</Grid>
						</MuiPickersUtilsProvider>
					</Box>
					<Box className={classes.insideBox}>
						<TextField
							label="体重"
							type="number"
							InputLabelProps={{
								shrink: true,
							}}
							variant="outlined"
							InputProps={{
								endAdornment: <InputAdornment position="end" className={classes.inputAdornment}><small>kg</small></InputAdornment>,
								inputProps: {
									step: 0.1,
									style: { textAlign: "center" }
								},
							}}
							size="medium"
							className={classes.textField}
							name="weight"
							onChange={e => {
								let num: any = Number(e.target.value)
								setWeight(num);
							}}
							value={weight}
						/>
					</Box>
					<Box className={classes.insideBox}>
						<TextField
							label="体脂肪"
							type="number"
							InputLabelProps={{
								shrink: true,
							}}
							variant="outlined"
							InputProps={{
								endAdornment:
									<InputAdornment position="end" className={classes.inputAdornment}><small>%</small></InputAdornment>,
								inputProps: {
									step: 0.1,
									style: { textAlign: "center" }
								},
							}}
							size="medium"
							className={classes.textField}
							name="bodyFat"
							onChange={e => {
								let num: any = Number(e.target.value)
								setBodyFat(num);
							}}
							value={bodyFat}
						/>
					</Box>
					<Box className={classes.insideBox}>
						<TextField
							label="皮下脂肪"
							type="number"
							InputLabelProps={{
								shrink: true,
							}}
							variant="outlined"
							InputProps={{
								endAdornment: <InputAdornment position="end" className={classes.inputAdornment}><small>%</small></InputAdornment>,
								inputProps: {
									step: 0.1,
									style: { textAlign: "center" }
								},
							}}
							size="medium"
							className={classes.textField}
							name="subcutaneousFat"
							onChange={e => {
								let num: any = Number(e.target.value)
								setSubcutaneousFat(num);
							}}
							value={subcutaneousFat}
						/>
					</Box>
					<Box className={classes.insideBox} width={1}>
						<Button
							fullWidth
							onClick={editWeight}
							variant="contained"
							color="primary"
							size="medium"
							startIcon={<PostAddIcon />}
						>
							Save
						</Button>
					</Box>
				</Box>
			</form>
		</React.Fragment >
	)
}

export default EditWeight;
