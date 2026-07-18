function Button({ variant, baseClass = 'btn', className = '', children, ...rest }) {
  const classes = [baseClass, variant && `${baseClass}--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}

export default Button
