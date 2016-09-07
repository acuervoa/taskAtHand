"use strict";

function TaskAtHandApp()
{
	var version = "v1.0",
	appStorage = new AppStorage("taskAtHand");

	function setStatus(message){
		$("#app>footer").text(message);
	}

	this.start = function() {

		$("#new-task-name").keypress(function(e){
			if (e.which == 13) // Enter key
			{
				addTask();
				return false;
			}

		}).focus();
		$("#app>header").append(version);
		setStatus("ready");
	};

	function addTask() {

		var taskName = $("#new-task-name").val();
		if (taskName) {
			addTaskElement(taskName);
			//reset the text field
			$("#new-task-name").val("").focus();
		}
	}

	function addTaskElement(taskName) {

		var $task = $("#task-template .task").clone();
		$("span.task-name", $task).text(taskName);

		$("#task-list").append($task);

		$("button.delete", $task).click(function() {
			removeTask($task);
		});

		$("button.move-up", $task).click(function() {
			moveTask($task, true);
		});

		$("button.move-down", $task).click(function() {
			moveTask($task, false);
		});

		$("span.task-name", $task).click(function() {
			onEditTaskName($(this));
		});

		$("input.task-name", $task).change(function(){
			onChangeTaskName($(this));
		}).blur(function() {
			$(this).hide().siblings("span.task-name").show();
		});
	}

	function onEditTaskName($span)
	{
		$span.hide()
			.siblings("input.task-name")
			.val($span.text())
			.show()
			.focus();
	}

	function onChangeTaskName($input) {
		$input.hide();
		var $span = $input.siblings("span.task-name");
		if ($input.val()) {
			$span.text($input.val());
		}
		$span.show();
	}

	function saveTaskList() {
		var tasks = [];
		$("#task-list .task span.task-name").each(function() {
			tasks.push($(this).text())
		});
		appStorage.setValue("taskList", tasks);
	}

	function removeTask($task) {
		$task.remove();
		saveTaskList();
	}

	function moveTask($task, moveUp) {
		if (moveUp) {
			$task.insertBefore($task.prev());
		} else {
			$task.insertAfter($task.next());
		}
		saveTaskList();
	}
}


$(function() {
	window.app = new TaskAtHandApp();
	window.app.start();
});