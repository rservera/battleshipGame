import PropTypes from 'prop-types';

export default function Input(props) {
  const {
    name, type, label, className, onChange, value,
    reference, placeholder,
  } = props;

  return (
    <div className={`input-wrapper ${className}`}>
      { label && (
        <label htmlFor={name} className="input-label">
          { label }
        </label>
      )}
      <input
        type={type}
        name={name}
        ref={reference}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
}

Input.defaultProps = {
  className: '',
  label: '',
  name: '',
  type: 'text',
  reference: null,
  onChange: () => {},
  placeholder: '',
  value: undefined,
};

Input.propTypes = {
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  name: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  reference: PropTypes.shape({}),
  placeholder: PropTypes.string,
  value: PropTypes.string,
};
