import React, { useState, useEffect, createContext } from 'react'

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'

import axios from 'axios'

import AddWeight from './AddWeight'
import EditWeight from './EditWeight'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import IconButton from '@material-ui/core/IconButton'
import ReplayIcon from '@material-ui/icons/Replay'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

import authHeader from '../services/auth-header'

interface Weight {
	id: number,
	userId: number,
	weight: number,
	bodyFat: number,
	subcutaneousFat: number,
	recordDate: string
}
const weightInitial: Weight = {
	id: 0,
	userId: 0,
	weight: 0,
	bodyFat: 0,
	subcutaneousFat: 0,
	recordDate: ''
}

function getModalStyle() {
	return {
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
	}
}
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			position: 'absolute',
			backgroundColor: theme.palette.background.paper,
			boxShadow: theme.shadows[5],
			padding: theme.spacing(2, 4, 3),
		},
		fab: {
			position: 'fixed',
			bottom: 5,
			right: 5,
		},
	}),
)

export const ListContext: any = createContext([[weightInitial], () => { }])
export const TargetContext = createContext(weightInitial)
export const AddModalContext: any = createContext([false, () => { }])
export const EditModalContext: any = createContext([false, () => { }])

const UserList = () => {

	const classes = useStyles();

	const [modalStyle] = useState(getModalStyle)
	const [weights, setWeights] = useState([weightInitial])
	const [targetWeight, setTargetWeight] = useState(weightInitial)
	const [addModal, setAddModal] = useState(false)
	const [editModal, setEditModal] = useState(false)

	const ROOT_URL = "http://localhost:8080"

	const fetchData = async () => {
		const res = await axios.get(`${ROOT_URL}/api/weight`, { headers: authHeader() })
		res.data.forEach((item: any, index: number) => {
			res.data[index].recordDate = item.recordDate.substring(0, item.recordDate.indexOf("T"))
		})
		setWeights(res.data)
	}

	const handleAddModalOpen = () => {
		setAddModal(true)
	}
	const handleAddModalClose = () => {
		setAddModal(false)
	}
	const handleEditModalOpen = (e: any) => {
		let targetId = e.currentTarget.getAttribute('data-num')
		let targetWeightArray = weights.filter(item => {
			if (item.id == targetId) return true;
		});
		setTargetWeight(targetWeightArray[0])
		setEditModal(true)
	}
	const handleEditModalClose = () => {
		setEditModal(false)
	}
	const handleDelete = async (e: any) => {
		e.preventDefault();
		let targetId = e.currentTarget.getAttribute('data-num')
		const ROOT_URL = "http://localhost:8080";

		await axios.delete(`${ROOT_URL}/api/weight/${targetId}`, {
			headers: authHeader()
		})
		await fetchData()
	}

	const handleReload = () => {
		fetchData()
	}

	useEffect(() => {
		fetchData()
	}, [])

	const addModalBody = (
		<div style={modalStyle} className={classes.paper}>
			<ListContext.Provider value={[weights, setWeights]}>
				<AddModalContext.Provider value={[addModal, setAddModal]}>
					<AddWeight />
				</AddModalContext.Provider>
			</ListContext.Provider>
		</div>
	);

	const editModalBody = (
		<div style={modalStyle} className={classes.paper}>
			<ListContext.Provider value={[weights, setWeights]}>
				<TargetContext.Provider value={targetWeight}>
					<EditModalContext.Provider value={[editModal, setEditModal]}>
						<EditWeight />
					</EditModalContext.Provider>
				</TargetContext.Provider>
			</ListContext.Provider>
		</div>
	);

	return (
		<React.Fragment>
			<TableContainer>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell align='center'>日付</TableCell>
							<TableCell align='center'>体重</TableCell>
							<TableCell align='center'>体脂肪</TableCell>
							<TableCell align='center'>皮下脂肪</TableCell>
							<TableCell align='center'>
								<IconButton color="primary" aria-label="reload" onClick={handleReload}>
									<ReplayIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{weights.map(weight => (
							<TableRow key={weight.id}>
								<TableCell align='center'>{weight.recordDate}</TableCell>
								<TableCell align='center'>{weight.weight}<small>kg</small></TableCell>
								<TableCell align='center'>{weight.bodyFat}<small>%</small></TableCell>
								<TableCell align='center'>{weight.subcutaneousFat}<small>%</small></TableCell>
								<TableCell align='center'>
									<IconButton aria-label="edit" onClick={handleEditModalOpen} data-num={weight.id}>
										<EditIcon />
									</IconButton>
									<IconButton aria-label="edit" onClick={handleDelete} data-num={weight.id}>
										<DeleteIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Fab color="primary" aria-label="add" onClick={handleAddModalOpen} className={classes.fab}>
				<AddIcon fontSize="large" />
			</Fab>
			<Modal
				open={addModal}
				onClose={handleAddModalClose}
			>
				{addModalBody}
			</Modal>
			<Modal
				open={editModal}
				onClose={handleEditModalClose}
			>
				{editModalBody}
			</Modal>
		</React.Fragment>
	)
}

export default UserList
