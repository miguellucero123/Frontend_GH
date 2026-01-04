from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database, cpm_engine

router = APIRouter(
    prefix="/projects",
    tags=["projects"]
)

@router.post("/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(database.get_db)):
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    projects = db.query(models.Project).offset(skip).limit(limit).all()
    return projects

@router.get("/{project_id}/tasks/", response_model=List[schemas.Task])
def read_tasks(project_id: int, db: Session = Depends(database.get_db)):
    tasks = db.query(models.Task).filter(models.Task.project_id == project_id).all()
    return tasks

@router.post("/{project_id}/tasks/", response_model=schemas.Task)
def create_task_for_project(project_id: int, task: schemas.TaskCreate, db: Session = Depends(database.get_db)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_task = models.Task(**task.dict(), project_id=project_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.post("/{project_id}/dependencies/")
def create_dependency(project_id: int, dependency: schemas.DependencyCreate, db: Session = Depends(database.get_db)):
    # Verify tasks exist and belong to project (logic simplified)
    db_dep = models.Dependency(**dependency.dict())
    db.add(db_dep)
    db.commit()
    return {"status": "ok", "id": db_dep.id}

@router.post("/{project_id}/calculate/", response_model=schemas.CalculationResult)
def calculate_project_cpm(project_id: int, db: Session = Depends(database.get_db)):
    # 1. Fetch all tasks and dependencies for the project
    tasks = db.query(models.Task).filter(models.Task.project_id == project_id).all()
    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found for this project")
    
    # Get all dependencies where both pred and succ are in this project's tasks
    # (Simplified query: assuming global IDs don't conflict or we filter properly join)
    task_ids = [t.id for t in tasks]
    dependencies = db.query(models.Dependency).filter(
        models.Dependency.predecessor_id.in_(task_ids),
        models.Dependency.successor_id.in_(task_ids)
    ).all()

    # 2. Run CPM Engine
    try:
        results = cpm_engine.run_cpm_analysis(tasks, dependencies)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) # Circular dependency

    # 3. Update Database
    for t in tasks:
        if t.id in results:
            data = results[t.id]
            t.early_start = data['ES']
            t.early_finish = data['EF']
            t.late_start = data['LS']
            t.late_finish = data['LF']
            t.total_float = data['Float']
            t.is_critical = data['IsCritical']
            
            # Map relative days to real dates if needed
            # start_date = project_start + ES (days)
    
    db.commit()

    return {
        "project_id": project_id,
        "status": "Calculated Successfully",
        "updated_tasks": len(tasks)
    }
