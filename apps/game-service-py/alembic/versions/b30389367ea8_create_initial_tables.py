"""Create initial tables

Revision ID: b30389367ea8
Revises: 
Create Date: 2021-08-29 21:53:42.537117

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'b30389367ea8'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('favoriteGames',
    sa.Column('key', postgresql.UUID(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('key')
    )
    op.create_table('player',
    sa.Column('key', postgresql.UUID(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('favorite', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('key')
    )
    op.create_table('game',
    sa.Column('key', postgresql.UUID(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('date', sa.BIGINT(), nullable=True),
    sa.Column('duration', sa.Integer(), nullable=True),
    sa.Column('winningPlayerKey', postgresql.UUID(), nullable=True),
    sa.ForeignKeyConstraint(['winningPlayerKey'], ['player.key'], ),
    sa.PrimaryKeyConstraint('key')
    )
    op.create_table('gameRules',
    sa.Column('key', postgresql.UUID(), nullable=False),
    sa.Column('gameKey', postgresql.UUID(), nullable=True),
    sa.Column('startingScore', sa.Integer(), nullable=True),
    sa.Column('scoreIncreasesByDefault', sa.Boolean(), nullable=True),
    sa.Column('defaultScoreStep', sa.Integer(), nullable=True),
    sa.Column('rounds', sa.Integer(), nullable=True),
    sa.Column('minRoundsToWin', sa.Integer(), nullable=True),
    sa.Column('maxRounds', sa.Integer(), nullable=True),
    sa.Column('minRoundScore', sa.Integer(), nullable=True),
    sa.Column('maxRoundScore', sa.Integer(), nullable=True),
    sa.Column('minPlayers', sa.Integer(), nullable=True),
    sa.Column('maxPlayers', sa.Integer(), nullable=True),
    sa.Column('winningScore', sa.Integer(), nullable=True),
    sa.Column('canBust', sa.Integer(), nullable=True),
    sa.Column('highScoreWins', sa.Boolean(), nullable=True),
    sa.Column('setScores', postgresql.ARRAY(sa.Integer()), nullable=True),
    sa.ForeignKeyConstraint(['gameKey'], ['game.key'], ),
    sa.PrimaryKeyConstraint('key')
    )
    op.create_table('playerScoreHistory',
    sa.Column('key', postgresql.UUID(), nullable=False),
    sa.Column('currentScore', sa.Integer(), nullable=False),
    sa.Column('order', sa.Integer(), nullable=True),
    sa.Column('playerKey', postgresql.UUID(), nullable=True),
    sa.Column('gameKey', postgresql.UUID(), nullable=True),
    sa.ForeignKeyConstraint(['gameKey'], ['game.key'], ),
    sa.ForeignKeyConstraint(['playerKey'], ['player.key'], ),
    sa.PrimaryKeyConstraint('key')
    )
    op.create_table('scoreRound',
    sa.Column('key', postgresql.UUID(), nullable=False),
    sa.Column('playerScoreHistoryKey', postgresql.UUID(), nullable=True),
    sa.Column('scores', postgresql.ARRAY(sa.Integer()), nullable=True),
    sa.Column('roundScore', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['playerScoreHistoryKey'], ['playerScoreHistory.key'], ),
    sa.PrimaryKeyConstraint('key')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('scoreRound')
    op.drop_table('playerScoreHistory')
    op.drop_table('gameRules')
    op.drop_table('game')
    op.drop_table('player')
    op.drop_table('favoriteGames')
    # ### end Alembic commands ###
