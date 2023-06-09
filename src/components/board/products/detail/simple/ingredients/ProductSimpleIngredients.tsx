import { Fragment } from 'react';
import { ListItem, List, Typography, makeStyles, alpha } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Ingredient } from 'src/types/product';

const useStyles = makeStyles(theme => ({
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
    position: 'relative',
  },
  selected: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eaeaea',
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    '&:focus': {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
    },
  },
  list: {
    padding: 0,
  },
  header: {
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    padding: '7px 15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
    position: 'sticky',
    top: 0,
    backgroundColor: '#fafafa',
    zIndex: 100,
    [theme.breakpoints.down('sm')]: {
      top: -15,
    },
  },
  icon: {
    backgroundColor: '#fff',
    borderRadius: '50%',
    position: 'absolute',
    right: 15,
  },
}));

interface ProductSimpleIngredientsProps {
  ingredients: Ingredient[];
}

export default function ProductSimpleIngredients({ ingredients }: ProductSimpleIngredientsProps) {
  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.header}>
        <Typography variant="h6">Ingredientes</Typography>
      </div>
      <List className={classes.list}>
        {ingredients.map(additional => (
          <ListItem button className={additional.selected ? classes.selected : classes.listItem} key={additional.id}>
            <div>
              <Typography>{additional.name}</Typography>
            </div>
            {additional.selected && <CheckCircleIcon className={classes.icon} color="primary" />}
          </ListItem>
        ))}
      </List>
    </Fragment>
  );
}
