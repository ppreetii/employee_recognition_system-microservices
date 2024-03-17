"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(
        `
        CREATE OR REPLACE FUNCTION get_employee_of_the_day(
          IN input_date DATE
      )
      RETURNS TABLE (
          employee_id VARCHAR(255),
          employee_name VARCHAR(255),
          employee_email VARCHAR(255),
          employee_designation VARCHAR(255),
          time_taken NUMERIC,
          total_tasks BIGINT
      )
      LANGUAGE plpgsql
      AS 
      $$
      BEGIN
          RETURN QUERY
          WITH CompletedTasks AS (
              SELECT emp.id AS employee_id,
                    emp.name AS employee_name,
                    emp.email AS employee_email,
                    emp.designation AS employee_designation,
                    EXTRACT(EPOCH FROM task.date_completed - task.date_assigned) AS time_taken,
                    COUNT(task."employeeId") AS total_tasks
              FROM public."Tasks" AS task
              LEFT JOIN public."Employees" AS emp ON task."employeeId" = emp.id
              WHERE DATE(task.date_completed) = input_date
              AND task.status = 'Done'
              AND task.date_completed <= task.deadline
              GROUP BY task."employeeId", emp.name, emp.designation, emp.id, time_taken, emp.email
              ORDER BY total_tasks DESC, time_taken ASC, emp.name ASC
              LIMIT 1
          ),
          InProgressTasks AS (
              SELECT emp.id AS employee_id,
              emp.name AS employee_name,
              emp.email AS employee_email,
              emp.designation AS employee_designation,
              EXTRACT(EPOCH FROM task.date_completed - task.date_assigned) AS time_taken,
              COUNT(task."employeeId") AS total_tasks
                  FROM public."Tasks" AS task
                  LEFT JOIN public."Employees" AS emp ON task."employeeId" = emp.id
                  WHERE task.status = 'InProgress'
                    AND DATE(task.date_started) >= DATE(task.date_assigned)
                    AND DATE(task.date_started) <= DATE(task.deadline)
                    AND DATE(task.date_started) <= input_date
                    AND input_date >= DATE(task.date_assigned)
                    AND input_date <= DATE(task.deadline)
                  GROUP BY task."employeeId", emp.name, emp.designation, emp.id, time_taken, emp.email
                  ORDER BY total_tasks DESC, time_taken ASC, emp.name ASC
                  LIMIT 1
          )
          SELECT * FROM CompletedTasks
          UNION ALL
          SELECT * FROM InProgressTasks WHERE NOT EXISTS (SELECT 1 FROM CompletedTasks);
      END;
      $$;
            
      `,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(
        `DROP PROCEDURE IF EXISTS get_employee_of_the_day;`,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
