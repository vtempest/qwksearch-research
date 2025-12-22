import QuantumWaveOrbital from './theme/QuantumWaveOrbital';


const MessageBoxLoading = () => {
  return (
    <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <QuantumWaveOrbital
        autoRandomize={true}
        onSphereClick={() => console.log('Sphere clicked')}
        className="my-custom-class"
      />
    </div>
  );
};

export default MessageBoxLoading;
