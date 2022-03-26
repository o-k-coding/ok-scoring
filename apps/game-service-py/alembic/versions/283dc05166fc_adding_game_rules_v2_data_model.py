"""Adding game rules games data model

Revision ID: 283dc05166fc
Revises: b30389367ea8
Create Date: 2021-09-12 15:02:05.176637

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '283dc05166fc'
down_revision = 'b30389367ea8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('gameRulesV2',
    sa.Column('key', postgresql.UUID(), nullable=False),
    sa.Column('gameKey', postgresql.UUID(), nullable=True),
    sa.Column('validStateSchema', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    sa.Column('winningSchema', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    sa.Column('firstToScoreWins', sa.Boolean(), nullable=True),
    sa.Column('scoreIncreasesByDefault', sa.Boolean(), nullable=True),
    sa.Column('highScoreWins', sa.Boolean(), nullable=True),
    sa.Column('playersMustBeOnSameRound', sa.Boolean(), nullable=True),
    sa.Column('dealerSettings', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['gameKey'], ['game.key'], ),
    sa.PrimaryKeyConstraint('key')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('gameRulesV2')
    # ### end Alembic commands ###
