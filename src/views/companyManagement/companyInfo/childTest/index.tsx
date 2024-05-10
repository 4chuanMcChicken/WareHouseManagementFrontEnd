import React, { useImperativeHandle, useState, useEffect } from "react";
import { Button } from "antd";

const ChildTest = (props: any) => {
	const { showName, callBackClick } = props;

	useEffect(() => {
		console.log(showName);
	}, [showName]);

	const [buttonName, setButtonName] = useState("Initial Name");

	const refFunc = () => {
		console.log("child function do !!!");
	};

	useImperativeHandle(props.onRef, () => {
		// 需要将暴露的接口返回出去
		return {
			func: refFunc,
			setName: setButtonName
		};
	});

	return (
		<div>
			<Button type="primary" onClick={callBackClick}>
				{buttonName}
			</Button>
		</div>
	);
};

ChildTest.displayName = "ChildTest"; // 添加 displayName
export default ChildTest;
