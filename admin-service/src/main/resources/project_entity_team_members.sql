use employeedetails;
SELECT
    projects_project_id AS project_id,
    GROUP_CONCAT(team_members_employee_id ORDER BY team_members_employee_id SEPARATOR ', ') AS employee_id
FROM
    project_entity_team_members
GROUP BY
    projects_project_id;
    