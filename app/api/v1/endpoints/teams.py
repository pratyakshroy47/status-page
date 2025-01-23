from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.schemas import team as schemas
from app.models.team import Team
from app.models.user import User
from uuid import UUID

router = APIRouter()

@router.post("/", response_model=schemas.Team)
def create_team(
    *,
    db: Session = Depends(deps.get_db),
    team_in: schemas.TeamCreate,
):
    """Create new team."""
    team = Team(**team_in.dict())
    db.add(team)
    db.commit()
    db.refresh(team)
    return team

@router.get("/organization/{organization_id}", response_model=List[schemas.TeamWithMembers])
def get_organization_teams(
    organization_id: UUID,
    db: Session = Depends(deps.get_db),
):
    """Get all teams for an organization."""
    teams = db.query(Team).filter(Team.organization_id == organization_id).all()
    return teams

@router.post("/{team_id}/members/{user_id}")
def add_team_member(
    *,
    db: Session = Depends(deps.get_db),
    team_id: UUID,
    user_id: UUID,
):
    """Add a user to a team."""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    team.members.append(user)
    db.commit()
    return {"message": "User added to team"}

@router.delete("/{team_id}/members/{user_id}")
def remove_team_member(
    *,
    db: Session = Depends(deps.get_db),
    team_id: UUID,
    user_id: UUID,
):
    """Remove a user from a team."""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    team.members.remove(user)
    db.commit()
    return {"message": "User removed from team"} 